import React, { useContext, useReducer, useRef, useState } from 'react';

import { Button } from 'meiko/Button';
import Dialog from 'meiko/Dialog';
import FC from 'meiko/FormControls';
import LoadingBouncer from 'meiko/LoadingBouncer';

import { HeaderContext } from 'src/context';
import sendRequest from 'src/utils/sendRequest';

import { periods } from './TimePeriod';

import './RemindMe.scss';

interface ReminderState {
  loading: boolean;
  message: string;
  duration: string;
  period: string;
}

type ReminderAction =
  | { type: 'CHANGE'; name: string; value: any }
  | { type: 'CLEAR' | 'LOADING' };

const defaultState = {
  duration: '1',
  loading: false,
  message: '',
  period: '1'
};

function reducer(state: ReminderState, action: ReminderAction) {
  switch (action.type) {
    case 'CHANGE':
      return { ...state, [action.name]: action.value };
    case 'CLEAR':
      return { ...defaultState };
    case 'LOADING':
      return { ...state, loading: !state.loading };
    default:
      return state;
  }
}

export default function RemindMe() {
  const { onMessageRefresh } = useContext(HeaderContext);
  const openButtonRef = useRef() as React.MutableRefObject<HTMLButtonElement>;
  const [isOpen, setOpen] = useState(false);
  const [errors, setErrors] = useState(new Map<string, string>());
  const [state, dispatch] = useReducer(reducer, defaultState);

  const btnLabel = 'Open create reminder dialog';
  function closeDialog() {
    setOpen(false);
    setErrors(new Map());
    dispatch({ type: 'CLEAR' });
  }

  function onInputChange(
    e: React.FormEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.currentTarget;

    dispatch({
      name,
      type: 'CHANGE',
      value
    });
  }

  async function onSubmit() {
    if (state.loading) {
      return;
    }

    dispatch({ type: 'LOADING' });
    const err = new Map<string, string>([]);

    if (!state.message || !state.message.trim()) {
      err.set('message', 'Message is required.');
    }

    if (!state.duration) {
      err.set('duration', 'Duration is required.');
    } else if (isNaN(parseInt(state.duration.trim(), 10))) {
      err.set('duration', 'Duration must be a number above 0.');
    }

    if (!state.period) {
      err.set('period', 'Period is required.');
    } else if (isNaN(parseInt(state.period.trim(), 10))) {
      err.set('period', 'Period must be a number above 0.');
    }

    setErrors(err);
    if (err.size) {
      dispatch({ type: 'LOADING' });
      return;
    }

    const payload = {
      duration: Number(state.duration),
      location: window.location.href,
      message: state.message,
      period: Number(state.period)
    };

    const response = await sendRequest('/reddit/requestreminder', {
      body: JSON.stringify(payload),
      method: 'POST'
    });

    if (response.success) {
      closeDialog();
      onMessageRefresh(30);
    } else {
      err.set('server', response.errorMessages.join('\n'));
      setErrors(err);
    }

    dispatch({ type: 'LOADING' });
  }

  return (
    <div className="remind-me">
      <Button
        ref={openButtonRef}
        className="remind-me__button"
        btnStyle="primary"
        aria-label={btnLabel}
        title={btnLabel}
        icon={'\uD83D\uDD14\uFE0E'}
        onClick={(e) => setOpen(true)}
      />
      <Dialog
        isForm
        isOpen={isOpen}
        name="reminder"
        title="Create reminder"
        actionText="Create"
        onAction={onSubmit}
        onCancel={closeDialog}
        tabTrapProps={{
          firstId: 'message',
          lastId: 'reminderCancel',
          onDeactivate: () => {
            if (openButtonRef.current) {
              openButtonRef.current.focus();
            }
          }
        }}
      >
        <FC.ClearableInput
          id="message"
          name="message"
          label="Message"
          required
          value={state.message}
          onChange={onInputChange}
          onKeyPress={(e) => e.stopPropagation()}
          error={errors}
        />
        <div className="remind-me__row">
          <FC.ClearableInput
            type="number"
            id="duration"
            name="duration"
            label="duration"
            required
            min={1}
            value={state.duration}
            onChange={onInputChange}
            onKeyPress={(e) => e.stopPropagation()}
            error={errors}
          />
          <FC.SelectBox
            id="period"
            name="period"
            text="Period"
            required
            value={state.period}
            options={periods}
            onChange={onInputChange}
            error={errors}
          />
        </div>
        {errors.has('server') && (
          <div className="error-block">{errors.get('server')}</div>
        )}
        {state.loading && <LoadingBouncer />}
      </Dialog>
    </div>
  );
}
