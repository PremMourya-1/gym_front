function getLocaleStorageItem(key) {
  return JSON.parse(localStorage.getItem(key));
}
function setLocaleStorageItem(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}
function removeLoaleStorageItem(key) {
  return localStorage.removeItem(key);
}

export { getLocaleStorageItem, setLocaleStorageItem, removeLoaleStorageItem };
