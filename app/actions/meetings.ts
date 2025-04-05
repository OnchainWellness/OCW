'use server'
import axios from "axios";
import {KJUR} from 'jsrsasign'
import NodeCache from "node-cache";
import qs from 'querystring'
const myCache = new NodeCache();

const ZOOM_API_BASE_URL = process.env.ZOOM_API_BASE_URL
const ZOOM_OAUTH_ENDPOINT = process.env.ZOOM_OAUTH_ENDPOINT
const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;

export async function createMeeting  () {
  const {data: token, error } = await zoomTokenCheck()

  if (error) {
    return
  }

  try {
    const request = await axios.post(`${ZOOM_API_BASE_URL}/users/me/meetings`, {}, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    const signature = generateSignature(request.data.id, 0);
    return {
      
      ...request.data,
      signature
    }
  } catch (err) {
    console.log({err})
    throw new Error('Error creating meeting')
  }
} 

function generateSignature(meetingNumber: string, role: number) {
  const { ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;
  const iat = Math.round(new Date().getTime() / 1000) - 30
  const exp = iat + 60 * 60 * 2
  const oHeader = { alg: 'HS256', typ: 'JWT' }

  const oPayload = {
    sdkKey: ZOOM_CLIENT_ID,
    appKey: ZOOM_CLIENT_ID,
    mn: meetingNumber,
    role: role,
    iat: iat,
    exp: exp,
    tokenExp: exp
  }

  const sHeader = JSON.stringify(oHeader)
  const sPayload = JSON.stringify(oPayload)
  const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, ZOOM_CLIENT_SECRET)
  return sdkJWT
}

/**
  * Retrieve token from Zoom API
  *
  * @returns {Object} { access_token, expires_in, error }
  */
export const getToken = async () => {
  if (!ZOOM_OAUTH_ENDPOINT) {
    throw new Error('Internal server Error, try again later')
  }
  try {
    const request = await axios.post(
      ZOOM_OAUTH_ENDPOINT,
      qs.stringify({ grant_type: 'account_credentials', account_id: ZOOM_ACCOUNT_ID }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`,
        },
      },
    );

    const { access_token, expires_in } = await request.data;

    return { access_token, expires_in, error: null };
  } catch (error) {
    console.log(error)
    throw new Error('Error obtaining Zoom credentials. PLease try again later')
  }
};

/**
  * Set zoom access token with expiration in redis
  *
  * @param {Object} auth_object
  * @param {String} access_token
  * @param {int} expires_in
  */
export const setToken = async ({ access_token, expires_in}: {access_token: string, expires_in: number}) => {
  myCache.set('access_token', access_token,expires_in);
};

/**
  * Middleware that checks if a valid (not expired) token exists in redis
  * If invalid or expired, generate a new token, set in redis, and append to http request
  */
export const zoomTokenCheck = async () => {
  const cacheToken = myCache.get('access_token');

  let token = cacheToken;

  /**
    * Redis returns:
    * -2 if the key does not exist
    * -1 if the key exists but has no associated expire
    */
  if (!cacheToken || ['-1', '-2'].includes(cacheToken as string)) {
    const { access_token, expires_in, error } = await getToken();

    if (error) {
      console.log({error})
      return {
        error,
        data: null,
      }
    }

    setToken({ access_token, expires_in });
    token = access_token;
  }

  return {
    error: null,
    data: token,
  };
};
