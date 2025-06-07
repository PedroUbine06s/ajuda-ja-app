const BASE_URL = 'http://10.0.2.2:3000';

export interface ApiService {
    id: number;
name: string;
}

export const getServices = async (): Promise<ApiService[]> => {
try {
const response = await fetch(`${BASE_URL}/services`);
if (!response.ok) {
      throw new Error('Failed to fetch services from the API.');
    }
    const data: ApiService[] = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
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
  userType: 'COMMON' | 'PROVIDER';
  serviceIds?: number[];
  profilePictureUrl?: string;
}

export interface User {
    user : {
          id: number;
          name: string;
          email: string;
          userType: 'COMMON' | 'PROVIDER';
          dateOfBirth: string;
          phone: string;
          address: string;
          location?: {
              type: string,
              coordinates: number[]
          }
        },
    toke: string;
}

export const createAccount = async (payload: CreateUserPayload): Promise<User> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });


    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.message || 'Houve um erro ao criar o usuário.');
    }


    return await response.json();

  } catch (error) {
    console.error("Error in createAccount API call:", error);

    throw error;
  }
};

export const loginIntoAccount = async (payload: {email: string, password: string}): Promise<User> => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(payload)
         })

        if(!response.ok) {
            const errorData = await response.json()

            throw new Error(errorData.message || 'Houve um erro ao fazer o login')
        }

        return await response.json();
    } catch (error) {
        console.error("Error in login API call:", error);

        throw error
    }
}