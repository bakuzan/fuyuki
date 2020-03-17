import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';

import generateUniqueId from 'ayaka/generateUniqueId';
import { Button } from 'meiko/Button';
import Portal from 'meiko/Portal';
import TabTrap from 'meiko/TabTrap';

import { EventCodes } from 'meiko/constants/enums';
import MkoIcons from 'meiko/constants/icons';
import { useOutsideClick } from 'meiko/hooks/useOutsideClick';
import { MainContext } from 'src/context';

import './IndexWidget.scss';

type HTMLInheritKeys = 'className' | 'children';

export interface WidgetProps
  extends Pick<React.HTMLProps<HTMLElement>, HTMLInheritKeys> {
  isExpanded: boolean;
  isLocked?: boolean;
  name: string;
  title?: string;
  firstId: string;
  lastId: string;
  toggleZoneId: string;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  exceptionClasses?: string[];
}

export const WidgetToggleZone = ({ id }: { id: string }) => (
  <div id={id} className="widget-toggle-zone"></div>
);

function Widget(props: WidgetProps) {
  const {
    className,
    isExpanded,
    isLocked = false,
    name,
    title,
    toggleZoneId,
    firstId,
    lastId,
    children,
    setExpanded,
    exceptionClasses = []
  } = props;

  const { onSetSearch } = useContext(MainContext);
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;
  const toggleRef = useRef() as React.MutableRefObject<HTMLButtonElement>;
  const [widgetId] = useState(generateUniqueId());

  const isHidden = !isExpanded;
  const toggleBtnId = `toggleWidget-${widgetId}`;
  const closeBtnId = `closeWidget-${widgetId}`;
  const allExceptionClasses = ['widget-toggle', ...exceptionClasses];

  useEffect(() => {
    onSetSearch(isLocked ? true : isExpanded);
    return () => onSetSearch((p) => (isLocked ? false : p));
  }, [isExpanded, isLocked]);

  useOutsideClick(ref.current, (e) => {
    const t = e.target;
    const isEscape = e.key === EventCodes.Escape;
    const noTarget = !t;
    const isNotException =
      t && !allExceptionClasses.some((s) => t.className.includes(s));

    if (noTarget || isEscape || isNotException) {
      setExpanded(false);
    }
  });

  return (
    <TabTrap
      ref={ref}
      isActive={isExpanded && !isLocked}
      element="aside"
      firstId={isLocked ? firstId : closeBtnId}
      lastId={lastId ?? closeBtnId}
      onDeactivate={() => {
        const target = toggleRef.current;
        if (target) {
          target.focus();
        }
      }}
      aria-hidden={isHidden}
      className={classNames(
        'widget',
        {
          'widget--hidden': isHidden
        },
        className
      )}
    >
      {!isLocked && (
        <Portal querySelector={`#${toggleZoneId}`}>
          <Button
            ref={toggleRef}
            id={toggleBtnId}
            className="widget-toggle"
            aria-label={`Toggle ${name} widget`}
            title={`Toggle ${name} widget`}
            icon={`\uD83D\uDD0D\uFE0E`}
            onClick={() => setExpanded((p) => !p)}
          />
        </Portal>
      )}
      <header className="widget__header">
        {!isLocked && (
          <Button
            id={closeBtnId}
            className="widget__close"
            btnStyle="primary"
            aria-label={`Collapse ${name} widget`}
            title={`Collapse ${name} widget`}
            icon={MkoIcons.cross}
            onClick={() => setExpanded(false)}
          />
        )}
        {title && <h3 className="widget__title">{title}</h3>}
      </header>
      {children}
    </TabTrap>
  );
}

export default Widget;
