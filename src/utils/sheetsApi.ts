import { Player, LogEntry } from '../types';

export const extractPlayersFromSheet = async (spreadsheetId: string): Promise<Player[]> => {
  try {
    const response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Profiles!A2:B',
    });

    const values = response.result.values || [];
    const players: Player[] = [];

    for (const row of values) {
      const [name, team] = row;
      if (name && team) {
        players.push({ name: name.trim(), team: team.trim() });
      }
    }

    return players;
  } catch (error) {
    console.error('Error extracting players:', error);
    throw new Error('Failed to extract player data from the Profiles sheet');
  }
};

export const updateDashboard = async (
  spreadsheetId: string,
  playerName: string,
  team: string,
  scoreFormula: string = '=AVERAGE(C2:C10)' // Default formula, customizable
): Promise<void> => {
  try {
    const requests = [
      {
        updateCells: {
          range: {
            sheetId: await getSheetId(spreadsheetId, 'Dashboard'),
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: 2,
          },
          rows: [
            {
              values: [
                { userEnteredValue: { stringValue: playerName } },
                { userEnteredValue: { stringValue: team } },
              ],
            },
          ],
          fields: 'userEnteredValue',
        },
      },
      {
        updateCells: {
          range: {
            sheetId: await getSheetId(spreadsheetId, 'Dashboard'),
            startRowIndex: 7,
            endRowIndex: 8,
            startColumnIndex: 3,
            endColumnIndex: 4,
          },
          rows: [
            {
              values: [
                { userEnteredValue: { formulaValue: scoreFormula } },
              ],
            },
          ],
          fields: 'userEnteredValue',
        },
      },
    ];

    await window.gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: { requests },
    });
  } catch (error) {
    console.error('Error updating dashboard:', error);
    throw new Error('Failed to update dashboard with player data');
  }
};

export const getSheetId = async (spreadsheetId: string, sheetName: string): Promise<number> => {
  try {
    const response = await window.gapi.client.sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheet = response.result.sheets?.find(
      (s: any) => s.properties.title === sheetName
    );

    if (!sheet) {
      throw new Error(`Sheet '${sheetName}' not found`);
    }

    return sheet.properties.sheetId;
  } catch (error) {
    console.error('Error getting sheet ID:', error);
    throw new Error(`Failed to find sheet '${sheetName}'`);
  }
};

export const logToSheet = async (
  spreadsheetId: string,
  logEntry: LogEntry
): Promise<void> => {
  try {
    // First, ensure the PDF_Log sheet exists
    await ensureLogSheetExists(spreadsheetId);

    const values = [
      [
        logEntry.timestamp,
        logEntry.playerName,
        logEntry.team,
        logEntry.status,
        logEntry.message,
        logEntry.pdfLink || '',
      ],
    ];

    await window.gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'PDF_Log!A:F',
      valueInputOption: 'USER_ENTERED',
      resource: { values },
    });
  } catch (error) {
    console.error('Error logging to sheet:', error);
  }
};

const ensureLogSheetExists = async (spreadsheetId: string): Promise<void> => {
  try {
    await getSheetId(spreadsheetId, 'PDF_Log');
  } catch {
    // Sheet doesn't exist, create it
    const requests = [
      {
        addSheet: {
          properties: {
            title: 'PDF_Log',
            gridProperties: {
              rowCount: 1000,
              columnCount: 6,
            },
          },
        },
      },
    ];

    await window.gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: { requests },
    });

    // Add headers
    const headerValues = [
      ['Timestamp', 'Player Name', 'Team', 'Status', 'Message', 'PDF Link'],
    ];

    await window.gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'PDF_Log!A1:F1',
      valueInputOption: 'USER_ENTERED',
      resource: { values: headerValues },
    });
  }
};

export const exportToPDF = async (
  spreadsheetId: string,
  fileName: string
): Promise<string> => {
  try {
    const dashboardSheetId = await getSheetId(spreadsheetId, 'Dashboard');
    
    // Get the PDF export URL
    const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=pdf&gid=${dashboardSheetId}&portrait=true&fitw=true`;
    
    // Get access token
    const authInstance = window.gapi.auth2.getAuthInstance();
    const accessToken = authInstance.currentUser.get().getAuthResponse().access_token;
    
    // Fetch the PDF blob
    const response = await fetch(exportUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to export PDF');
    }
    
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    return fileName;
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw new Error('Failed to export PDF');
  }
};