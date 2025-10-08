
import { AddressModel, CustomerAddressModel } from "@/Model/DataModel";
import api from "@/utils/api";

export const fetchRegions = async (): Promise<AddressModel[]> => {
  const res = await api.post<AddressModel[]>(`/regions`);
  return res.data;
};

export const fetchPronvinces = async (value: any): Promise<AddressModel[]> => {
  const res = await api.post<AddressModel[]>(`/provinces`,{region_code:value});
  return res.data;
};

export const fetchCities = async (value: any): Promise<AddressModel[]> => {
  const res = await api.post<AddressModel[]>(`/cities`,{province_code:value});
  return res.data;
};

export const fetchBrgy = async (value: any): Promise<AddressModel[]> => {
  const res = await api.post<AddressModel[]>(`/brgys`,{city_code:value});
  return res.data;
};

export const fetchCustomerAddress = async (): Promise<CustomerAddressModel[]> => {
  const res = await api.get<CustomerAddressModel[]>(`/customer/address`);
  return res.data;
};

