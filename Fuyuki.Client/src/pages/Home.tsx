import React, { useState } from 'react';

import { useAsync } from '../hooks/useAsync';

function Home() {
  const [page, setPage] = useState(0);

  const state = useAsync<any[]>(async () => {
    const response = await fetch(`reddit/getrall/${page}`);
    const result = await response.json();
    return result;
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
