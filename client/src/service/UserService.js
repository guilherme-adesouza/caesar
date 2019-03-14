class UserService {
  static login = async(data) => {
    return await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(async (response) => {
      const json = await response.json();
      if(response.status === 200){
        return json;
      } else {
        throw Error(json.message);
      }
    });
  }
}

export default UserService;