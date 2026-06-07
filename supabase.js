const SUPABASE_URL = 'https://dbekrprkrdwdjglfyffl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_VyK4kvHEWdkGL3niL45tHw_eG7vZbqs';
const TABLE_NAME = 'players'; // Change this if your table has a different name

async function savePlayersData(data) {
  try {
    // First, try to update existing record (id = 1)
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?id=eq.1`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          data: data,
          updated_at: new Date().toISOString()
        })
      }
    );

    if (response.status === 204) {
      console.log('[SUPABASE] Data updated successfully');
      return { success: true, message: 'Data updated' };
    }

    // If no record exists, create new one
    if (response.status === 404 || response.status === 409) {
      const insertResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/${TABLE_NAME}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            id: 1,
            data: data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        }
      );

      if (insertResponse.ok || insertResponse.status === 201) {
        console.log('[SUPABASE] Data inserted successfully');
        return { success: true, message: 'Data created' };
      }
    }

    throw new Error(`Supabase responded with status ${response.status}`);
  } catch (error) {
    console.error('[SUPABASE ERROR]', error);
    throw error;
  }
}

async function getPlayersData() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?id=eq.1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const data = await response.json();
    if (data.length > 0) {
      console.log('[SUPABASE] Data retrieved successfully');
      return data[0].data;
    }
    return null;
  } catch (error) {
    console.error('[SUPABASE ERROR]', error);
    throw error;
  }
}

module.exports = { savePlayersData, getPlayersData };
