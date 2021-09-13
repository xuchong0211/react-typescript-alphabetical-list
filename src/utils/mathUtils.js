import dayjs from 'dayjs';

export const calculateAgeByBirthday = (birthday) => {
  try {
    const ageDifMs = dayjs().valueOf() - dayjs(birthday).valueOf();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  } catch (e) {
    console.log('calculate age error', e);
    return 0;
  }
};

export const calculateAgeByBirthdayFromDate = (birthday, date) => {
  try {
    const ageDifMs = dayjs(date).valueOf() - dayjs(birthday).valueOf();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  } catch (e) {
    console.log('calculate age from date error', e);
  }
};
