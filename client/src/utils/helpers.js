import { localFields } from './constants';

export const sendPostRequest = async (url, data) => {
  const token = localStorage.getItem(localFields.token);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return await getResponseData(response);
};

export const sendGetRequest = async (url) => {
  const token = localStorage.getItem(localFields.token);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return await getResponseData(response);
};

async function getResponseData(response) {
  const data = await response.json();

  if (!response.ok) {
    console.log(data);
    throw new Error(data.error || 'An unknown error occured.');
  }

  return data;
}
