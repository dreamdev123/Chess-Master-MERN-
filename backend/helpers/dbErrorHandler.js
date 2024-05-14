
/*
get unique error field name
*/


const uniqueMessage = (error) => {
  let output = '';
  try {
    output = `this ${error.errmsg.split('index:')[1].split('dup key')[0].split('_')[0]} is already exist`;
  } catch (ex) {
    output = 'unique filed already exist';
  }
  console.log(output);
  return output;
};

/*
get  error message from error object
*/

exports.errorHandler = (error) => {
  let message = '';
  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = uniqueMessage(error);
        break;
      default:
        message = 'something went wrong';
        break;
    }
  } else {
    for (const errorname in error.errorors) {
      if (error.errorors[errorName].message) message = error.errorors[error.name].message;
    }
  }
  return message;
};
