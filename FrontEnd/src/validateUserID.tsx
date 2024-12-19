import axios from 'axios';

const APIurl = "https://cs409-final-omega.vercel.app/api"

export const validateUserID = async (userID: string): Promise<boolean> => {
  try {
    console.log(userID);
    const response = await axios.get(`${APIurl}/users/${userID}`);
    return response.status === 200;
  } catch (err) {
    return false;
  }
};
