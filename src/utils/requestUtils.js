import _ from 'lodash';
import { createError } from './error';
import { Modal } from 'antd/lib/index';
import {
  SESSION_CONPTRACEITON_REPORT_TYPE,
  SESSION_MATERNITY_REPORT_TYPE,
  SESSION_MODE_CONTRACEPTION,
  SESSION_MODE_MATERNITY,
  SESSION_MODE_PEDIATRIC,
  SESSION_PEDIATRIC_REPORT_TYPE,
  SESSION_POSTPARTUM_REPORT_TYPE,
  SESSION_PRIMARY_REPORT_TYPE,
  SESSION_TYPE_POSTPARTUM
} from '../config/config';
import { logout } from './db/pouchDB';
import { getIntlError } from '../i18n/locales';
export const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const toFormData = (args) => {
  const data = new FormData();
  _.each(_.keys(args), (k) => {
    if (args[k]) {
      data.append(k, args[k]);
    }
  });
  return data;
};

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    if (response.redirected && response.url.indexOf('/login/auth') > -1) {
      throw createError(401, '');
    }
    return response;
  } else {
    throw response;
  }
}

export function checkReportStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    if (response.redirected && response.url.indexOf('/login/auth') > -1) {
      throw createError(401, '');
    }
    return response;
  } else {
    return response.json().then((error) => {
      throw error;
    });
  }
}

export function parseJSON(response) {
  try {
    const json = response.json();
    return json;
  } catch (err) {
    console.log('parse JSON error', err);
    return response;
  }
}

export const request = ({ args, method, url }) => {
  return fetch(`${SERVER_URL}/${url}?ajax=true`, {
    method,
    body: args ? toFormData(args) : null,
    credentials: 'include'
  })
    .then(checkStatus)
    .then(parseJSON);
};

const reportRequest = async ({ args, method, url }) => {
  return fetch(`${SERVER_URL}/${url}`, {
    method,
    body: args ? JSON.stringify(args) : null,
    contentType: 'application/json',
    credentials: 'include'
  })
    .then(checkReportStatus)
    .then((res) => {
      return Promise.resolve(res)
        .then((response) => {
          const reader = response.body.getReader();
          return new ReadableStream({
            start(controller) {
              return pump();
              function pump() {
                return reader.read().then(({ done, value }) => {
                  // When no more data needs to be consumed, close the stream
                  if (done) {
                    controller.close();
                    return;
                  }
                  // Enqueue the next data chunk into our target stream
                  controller.enqueue(value);
                  return pump();
                });
              }
            }
          });
        })
        .then((stream) => new Response(stream))
        .then((response) => response.blob());
    });
};

export const downloadReport = async (args, filename) => {
  console.log('download emr report : ', args, filename);
  const blob = await reportRequest({
    url: 'export/report',
    method: 'POST',
    args
  });
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename || args.report}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const getEMRDownloadName = (session) => {
  if (session.mode == SESSION_MODE_MATERNITY) {
    if (session.type == SESSION_TYPE_POSTPARTUM) {
      return SESSION_POSTPARTUM_REPORT_TYPE;
    } else {
      return SESSION_MATERNITY_REPORT_TYPE;
    }
  } else if (session.mode == SESSION_MODE_CONTRACEPTION) {
    return SESSION_CONPTRACEITON_REPORT_TYPE;
  } else if (session.mode == SESSION_MODE_PEDIATRIC) {
    return SESSION_PEDIATRIC_REPORT_TYPE;
  } else {
    return SESSION_PRIMARY_REPORT_TYPE;
  }
};

const handleReceivedReport = (filename, blob) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadEMRReport = async (session) => {
  const filename = `emr_${getEMRDownloadName(session)}_${session.timestamp}`;
  console.log('filename', filename);
  const blob = await reportRequest({
    url: 'export/emr',
    method: 'POST',
    args: { id: session._id }
  });
  return { filename, blob };
};

const downloadPediatricStatsFn = async (locations) => {
  // console.log(' download pediatric stats for locations..........', locations);
  const filename = `pediatric_stats_${+new Date()}`;
  // console.log('filename', filename);
  const blob = await reportRequest({
    url: 'export/stats',
    method: 'POST',
    args: { ids: locations, report: SESSION_PEDIATRIC_REPORT_TYPE }
  });
  return { filename, blob };
};

const getHandleDownloadFn = (reqwest, fn) =>
  reqwest(async (...args) => {
    try {
      const { filename, blob } = await fn(...args);
      handleReceivedReport(filename, blob);
    } catch (e) {
      console.log('get Handle Download Fn error', e);
      if (e.status === 401) {
        throw {
          message: getIntlError('require.relogin'),
          status: e.status,
          callback: async () => {
            await logout();
          }
        };
      } else {
        throw {
          ...e,
          message: e.message || getIntlError('report.download.error')
        };
      }
    }
  });

export const getDownloadEMRFn = (reqwest) =>
  getHandleDownloadFn(reqwest, downloadEMRReport);

export const getDownloadPediatricStatsFn = (reqwest) =>
  getHandleDownloadFn(reqwest, downloadPediatricStatsFn);

export function deleteConfirm(title, content) {
  Modal.confirm({
    title,
    content,
    onOk() {
      return true;
    },
    onCancel() {
      return false;
    }
  });
}

export function confrimSelection(title, message = '') {
  return new Promise(function (resolve, reject) {
    Modal.confirm({
      title,
      message,
      onOk() {
        resolve(true);
      },
      onCancel() {
        resolve(false);
      }
    });
  });
}

export const parseQueryString = function (str) {
  var objURL = {};

  str.replace(
    new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
    function ($0, $1, $2, $3) {
      objURL[$1] = $3;
    }
  );
  return objURL;
};
