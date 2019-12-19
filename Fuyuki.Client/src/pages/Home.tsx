import React, { useState } from 'react';

import { useAsync } from '../hooks/useAsync';
import sendRequest from '../utils/sendRequest';

function Home() {
  const [page, setPage] = useState(0);

  const state = useAsync<any[]>(async () => {
    return await sendRequest(`reddit/getrall/${page}`);
  }, [page]);

  console.log('HOME', page, state);

  return (
    <div>
      <h1>Hello, world!</h1>
      <p>This is the placeholder home page</p>
      <button type="button" onClick={() => setPage((p) => p + 1)}>
        Next Page
      </button>
    </div>
  );
}

export default Home;
