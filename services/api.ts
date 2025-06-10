const BASE_URL = "https://sinanju.uk";

export interface ApiService {
  id: number;
  name: string;
}

export const getServices = async (): Promise<ApiService[]> => {
  try {
    const response = await fetch(`${BASE_URL}/services`);
    if (!response.ok) {
      throw new Error("Failed to fetch services from the API.");
    }
    const data: ApiService[] = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export interface CreateUserPayload {
  name: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  password: string;
  userType: "COMMON" | "PROVIDER";
  serviceIds?: number[];
  profilePictureUrl?: string;
}

export interface User {
  user: {
    id: number;
    name: string;
    email: string;
    userType: "COMMON" | "PROVIDER";
    dateOfBirth: string;
    phone: string;
    address: string;
    location?: {
      type: string;
      coordinates: number[];
    };
  };
  token: string;
}

export const createAccount = async (
  payload: CreateUserPayload
): Promise<User> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.message || "Houve um erro ao criar o usuário.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in createAccount API call:", error);

    throw error;
  }
};

export const loginIntoAccount = async (payload: {
  email: string;
  password: string;
}): Promise<User> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.message || "Houve um erro ao fazer o login");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in login API call:", error);

    throw error;
  }
};

export const patchLoggedUserLocation = async (
  token: string,
  latitutede: number,
  longitude: number
) => {
  const endPoint = `${BASE_URL}/users/me/location`;

  try {
    const response = await fetch(endPoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        latitude: latitutede,
        longitude: longitude,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Falha ao atualizar a localização do usuário."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in patchLoggedUserLocation API call:", error);
    throw error;
  }
};

export const getMyServicesRequests = async (token: string) => {
  const endPoint = `${BASE_URL}/service-requests/my-received-requests`;

  try {
    const response = await fetch(endPoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Falha ao obter as solicitações de serviço."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getMyServicesRequests API call:", error);
    throw error;
  }
};

export const getNearbyProviders = async (
  token: string,
  latitude: number,
  longitude: number,
  radius?: number
) => {
  const endPoint = `${BASE_URL}/users/nearby-providers`;
  const params = new URLSearchParams({
    lat: latitude.toString(),
    lng: longitude.toString(),
  });

  if (radius) {
    params.append("radius", radius.toString());
  }

  const urlWithParams = `${endPoint}?${params.toString()}`;
  try {
    const response = await fetch(urlWithParams, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Falha ao obter provedores próximos."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getNearbyProviders API call:", error);
    throw error;
  }
};

export const createServiceRequest = async (
  token: string,
  serviceProviderId: number
) => {
  const endPoint = `${BASE_URL}/service-requests`;
  console.log(serviceProviderId);
  try {
    const requestBody: any = {
      serviceProviderId,
    };

    const response = await fetch(endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Falha ao criar solicitação de serviço."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in createServiceRequest API call:", error);
    throw error;
  }
};
