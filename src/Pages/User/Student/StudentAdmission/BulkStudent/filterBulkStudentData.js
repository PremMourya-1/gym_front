function isExistInDb(row, oldData, type) {
  const isExist = oldData.some((item) => Number(item[type]) === row[type]);

  return isExist ? true : false;
}

export default function filterBulkStudentData(xlData, oldData, checkValues) {
  const filterByCheckedValues = xlData.filter((item, i) => {
    return checkValues[item.id];
  });

  // const deviceIdAlreadyExistsInXlFile = filterByCheckedValues.

  // filter by existing admission id From Database
  const filterByExistingAdmInDataBase = filterByCheckedValues.filter((item) => {
    return (
      item.admissionNo !==
      oldData.find((it) => it.admissionNo === item.admissionNo)?.admissionNo
    );
  });

  const filterByDeviceId = filterByExistingAdmInDataBase.filter((item) => {
    return (
      item.deviceId !==
      Number(
        oldData.find((it) => Number(it.deviceId) === item.deviceId)?.deviceId
      )
    );
  });

  const admExistInXl = {};

  const filteredByAdmExistingInXlFile = filterByDeviceId.filter((item) => {
    if (!admExistInXl[item.admissionNo]) {
      admExistInXl[item.admissionNo] = true;
      return item;
    }
  });

  const DeviceIdExistInXl = {};

  const filterByDeviceIdExistingInXlFile = filteredByAdmExistingInXlFile.filter(
    (item) => {
      if (!DeviceIdExistInXl[item.deviceId]) {
        DeviceIdExistInXl[Number(item.deviceId)] = true;
        return item;
      }
    }
  );

  return filterByDeviceIdExistingInXlFile;
}

export { isExistInDb };
