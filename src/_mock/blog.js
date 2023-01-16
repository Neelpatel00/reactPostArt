/* eslint-disable prefer-template */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
import axios from 'axios';
import base_url from '../apis';

const getData = async() => {
  let jwt_token = JSON.parse(localStorage.getItem('jwt_token'));
  const result = await axios.get(`${base_url}admin/cat`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + jwt_token,
    }
  });

  const cat = result.data.cat.map( (doc) => ({
    id:doc._id,
    avatarUrl : doc.image_url,
    name:doc.cat_name,
    visibility:doc.visibility,
    parent_category_id:doc.parent_category_id,
    date:doc.date,
    createdAt:doc.createdAt,
    updatedAt:doc.updatedAt
  }))

  const sub_cat = result.data.sub_cat.map( (doc) => ({
    id:doc._id,
    avatarUrl : doc.image_url,
    name:doc.cat_name,
    visibility:doc.visibility,
    parent_category_id:doc.parent_category_id,
    date:doc.date,
    createdAt:doc.createdAt,
    updatedAt:doc.updatedAt
  }))
  


  return {cat, sub_cat};
}

// ----------------------------------------------------------------------


// export default users;

export { getData };
