'use strict';

const metrics = require('squishy-metrics');

const validate = require('./validate');

module.exports = function(blobs, by) {
  if( blobs.length > 1 )
    console.warn('Merging ' + blobs.length + ' blobs.'); // eslint-disable-line no-console

  const result = {
    data: null,
    metadata: {
      project_key: by.project_key,
      min_timestamp: Number.MAX_SAFE_INTEGER,
      max_timestamp: Number.MIN_SAFE_INTEGER
    }
  };
 
  blobs.forEach(blob => {
    result.data = metrics.merge.algorithm(result.data,blob.data);
    result.metadata.min_timestamp = Math.min(result.metadata.min_timestamp, blob.metadata.min_timestamp);
    result.metadata.max_timestamp = Math.max(result.metadata.max_timestamp, blob.metadata.max_timestamp);
  });

  return Promise.resolve(validate(JSON.parse(JSON.stringify(result))));
};
