/* tslint:disable:object-literal-sort-keys */
import generateUniqueId from 'ayaka/generateUniqueId';

enum AlertType {
  ERROR = 'error'
}

export interface Alert {
  type: AlertType.ERROR;
  id: string;
  message: string;
  detail: string;
}

class AlertService {
  public register(trigger: (alert: Alert) => void) {
    this.trigger = trigger;
  }

  public showError(message: string, detail: string) {
    this.trigger({
      id: generateUniqueId(),
      type: AlertType.ERROR,
      message,
      detail
    });
  }

  private trigger = (alert: Alert) => {
    console.log('No alert trigger set.');
  };
}

const inst = new AlertService();

export default inst;
