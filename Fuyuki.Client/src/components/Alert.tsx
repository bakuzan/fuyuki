import React, { useEffect, useRef, useState } from 'react';

import MkoAlert from 'meiko/Alert';
import service, { Alert } from 'src/utils/alertService';

function FykAlert({ ...props }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const timer = useRef<number>(0);

  function handleDismiss() {
    setAlerts((p) => p.slice(1));
  }

  useEffect(() => {
    function triggerAlert(alert: Alert) {
      setAlerts([alert]);

      clearTimeout(timer.current);
      timer.current = window.setTimeout(handleDismiss, 7500);
    }

    service.register(triggerAlert);
  }, []);

  if (!alerts.length) {
    return null;
  }

  return (
    <MkoAlert
      {...props}
      alerts={alerts}
      actions={{ dismissAlertMessage: handleDismiss }}
    />
  );
}

export default FykAlert;
