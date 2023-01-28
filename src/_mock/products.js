/* eslint-disable prefer-template */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
import axios from 'axios';
import base_url from '../apis';

const getData = async() => {
  let jwt_token = JSON.parse(localStorage.getItem('jwt_token'));
  const result = await axios.post(`${base_url}admin/react_images`,{}, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + jwt_token,
    }
  });

  const users = result.data.images.map( (doc) => ({
    id:doc._id,
    avatarUrl : `https://gitlab.com/ayurvedchikitsamd/post_art_one/-/raw/main/${doc.image_url}`,
    name:doc.festival_name,
    image_visibility:doc.image_visibility,
    year:doc.year,
    amount:doc.amount,
    text_color:doc.text_color,
    resolution:doc.resolution,
    default_frames:doc.default_frames,
    isBackground:doc.isBackground,
    cat_id:doc.cat_id,
    subcat_id:doc.subcat_id,
    image_date:doc.image_date,
    createdAt:doc.createdAt,
    updatedAt:doc.updatedAt
  }))
  


  return users;
}

// ----------------------------------------------------------------------


// export default users;

export { getData };
