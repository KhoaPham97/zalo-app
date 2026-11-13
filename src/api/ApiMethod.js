import axios from "./axios.js";

export const getRequest = async ({ url, params = {} }) => {
  try {
    const res = await axios.get(url, { params });
    return res.data;
  } catch (err) {
    return err;
  }
};

//  OR =====> In case of Redux Thunk  <======
//  export const getRequest = async ({ url, params = {}, thunkApi }) => {
//    try {
//      const res = await axios.get(url, { params });
//      return res.data;
//    } catch (err) {
//      return thunkApi.rejectWithValue(err);
//      return err;
//    };
//  };

export const postRequest = async ({ url, data = {}, params = {} }) => {
  try {
    const res = await axios.post(url, data, { params });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const postFormDataRequest = async ({ url, data = {}, params = {} }) => {
  try {
    const res = await axios.post(url, data, {
      params,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const patchRequest = async ({ url, data = {}, params = {} }) => {
  try {
    const res = await axios.patch(url, data, { params });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const patchFormDataRequest = async ({ url, data = {}, params = {} }) => {
  try {
    const res = await axios.patch(url, data, {
      params,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const putRequest = async ({ url, data = {}, params = {} }) => {
  try {
    const res = await axios.put(url, data, { params });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const deleteRequest = async ({ url, params = {} }) => {
  try {
    const res = await axios.delete(url, { params });
    return res.data;
  } catch (err) {
    return err;
  }
};
