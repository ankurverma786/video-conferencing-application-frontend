export const joinMeeting = async (roomCode, token) => {
  const response = await fetch(
    "http://localhost:5000/api/meetings/join",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roomCode }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const createRoom = async (title, token) => {
  const response = await fetch(
    "http://localhost:5000/api/rooms",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const loginUser = async (form) => {
  const res = await fetch( 
    "http://localhost:5000/api/auth/login",
    {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body:JSON.stringify(form)
  });

  const data = await res.json();

  if(!res.ok) throw new Error(data.message);

  return data;
};

export const registerUser = async (form) => {
  const res = await fetch("http://localhost:5000/api/auth/register", {
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(form)
  });

  const data = await res.json();

  if(!res.ok) throw new Error(data.message);

  return data;
};