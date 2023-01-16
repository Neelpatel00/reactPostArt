/* eslint-disable prefer-template */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
import axios from 'axios';
import base_url from '../apis';

const getData = async() => {
  let jwt_token = JSON.parse(localStorage.getItem('jwt_token'));
  const result = await axios.post(`${base_url}admin/react_users`,{}, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + jwt_token,
    }
  });

  const users = result.data.users.map( (doc) => ({
    id:doc._id,
    avatarUrl : `/assets/images/avatars/avatar_default.jpg`,
    name:doc.full_name,
    company:doc.business_name,
    phone:doc.phone,
    wallet:doc.wallet,
    createdAt:doc.createdAt,
    updatedAt:doc.updatedAt
  }))
  


  return users;
}

// ----------------------------------------------------------------------


// export default users;

export { getData };
