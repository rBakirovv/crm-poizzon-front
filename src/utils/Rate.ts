import { BASE_URL } from "./constants";

const HEADERS = {
  "Content-Type": "application/json",
};

export const getRate = () => {
  return fetch(`${BASE_URL}/rate`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const createRate = () => {
  return fetch(`${BASE_URL}/rate/create`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
  }).then(checkResponse);
};

export const updateRate = (id: string, newRate: string) => {
  return fetch(`${BASE_URL}/rate/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      newRate,
    }),
  }).then(checkResponse);
};

export const getVeritableRate = () => {
  return fetch(`${BASE_URL}/veritable-rate`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const createVeritableRate = () => {
  return fetch(`${BASE_URL}/veritable-rate/create`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
  }).then(checkResponse);
};

export const updateVeritableRate = (id: string, newRate: string) => {
  return fetch(`${BASE_URL}/veritable-rate/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      newRate,
    }),
  }).then(checkResponse);
};

export const getCommissionData = () => {
  return fetch(`${BASE_URL}/commission`, {
    credentials: "include",
    method: "GET",
    headers: HEADERS,
  }).then(checkResponse);
};

export const updateCommissionStatistics = (
  id: string,
  sneakersChina: string,
  sneakersRussia: string,
  winterShoesChina: string,
  winterShoesRussia: string,
  jacketChina: string,
  jacketRussia: string,
  sweatshirtChina: string,
  sweatshirtRussia: string,
  tShirtChina: string,
  tShirtRussia: string,
  socksChina: string,
  socksRussia: string,
  bagChina: string,
  bagRussia: string,
  perfumeChina: string,
  perfumeRussia: string,
  pantsChina: string,
  pantsRussia: string,
  headdressChina: string,
  headdressRussia: string,
  techniqueChina: string,
  techniqueRussia: string,
  otherChina: string,
  otherRussia: string,
  commission: string
) => {
  return fetch(`${BASE_URL}/commission/update/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({
      sneakersChina: sneakersChina,
      sneakersRussia: sneakersRussia,
      winterShoesChina: winterShoesChina,
      winterShoesRussia: winterShoesRussia,
      jacketChina: jacketChina,
      jacketRussia: jacketRussia,
      sweatshirtChina: sweatshirtChina,
      sweatshirtRussia: sweatshirtRussia,
      tShirtChina: tShirtChina,
      tShirtRussia: tShirtRussia,
      socksChina: socksChina,
      socksRussia: socksRussia,
      bagChina: bagChina,
      bagRussia: bagRussia,
      perfumeChina: perfumeChina,
      perfumeRussia: perfumeRussia,
      pantsChina: pantsChina,
      pantsRussia: pantsRussia,
      headdressChina: headdressChina,
      headdressRussia: headdressRussia,
      techniqueChina: techniqueChina,
      techniqueRussia: techniqueRussia,
      otherChina: otherChina,
      otherRussia: otherRussia,
      commission: commission,
    }),
  }).then(checkResponse);
};

const checkResponse = (res: Response) => {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(res.status);
  }
};
