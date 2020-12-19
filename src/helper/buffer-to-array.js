const getArrayFromBuffer = (response) => {
  response.forEach((resp) => {
    const bufferStatus = [...resp.Active_Passive];
    resp.Active_Passive = bufferStatus[0];
  });
};

module.exports = { getArrayFromBuffer };
