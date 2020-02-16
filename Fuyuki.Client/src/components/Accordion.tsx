import classNames from 'classnames';
import React, { useState } from 'react';

import styles from './AccordionStyle';

interface AccordionToggleProps {
  className: string;
  heading: React.ReactNode;
  onToggle: () => void;
}

interface AccordionProps extends React.HTMLProps<HTMLDivElement> {
  defaultIsCollapsed?: boolean;
  contentProps?: React.HTMLProps<HTMLDivElement>;
  headingProps?: React.HTMLProps<HTMLDivElement>;
  toggleComponent?: React.FunctionComponent<AccordionToggleProps>;
  heading: React.ReactNode;
  children: React.ReactNode | ((isCollapsed: boolean) => React.ReactNode);
}

function AccordionToggle({
  className,
  heading,
  onToggle
}: AccordionToggleProps) {
  return (
    <button type="button" className={className} onClick={onToggle}>
      {heading}
    </button>
  );
}

function Accordion({
  children,
  className,
  contentProps = {},
  defaultIsCollapsed,
  headingProps = {},
  heading,
  toggleComponent = AccordionToggle,
  ...pass
}: AccordionProps) {
  const [isCollapsed, setCollapsed] = useState(defaultIsCollapsed ?? true);
  const Toggler = toggleComponent;

  return (
    <div
      {...pass}
      className={classNames('accordion', styles.accordion, className)}
    >
      <div
        {...headingProps}
        className={classNames(
          'accordion__heading',
          styles.accordion__heading,
          headingProps.className
        )}
      >
        <Toggler
          className={classNames(
            'accordion__toggle',
            styles.accordion__toggle,
            isCollapsed && [
              'accordion__toggle--checked',
              styles.accordion__toggle_collapsed
            ]
          )}
          heading={heading}
          onToggle={() => setCollapsed((p) => !p)}
        />
      </div>
      <div
        {...contentProps}
        aria-hidden={isCollapsed}
        className={classNames(
          'accordion__content',
          styles.accordion__content,
          contentProps.className,
          isCollapsed && [
            'accordion__content--collapsed',
            styles.accordion__content_collapsed
          ]
        )}
      >
        {typeof children !== 'function' ? children : children(isCollapsed)}
      </div>
    </div>
  );
}

// Accordion.propTypes = {
//   heading: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.element,
//     PropTypes.node
//   ]).isRequired,
//   defaultIsCollapsed: PropTypes.bool,
//   children: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.element,
//     PropTypes.node
//   ])
// };

export default Accordion;
