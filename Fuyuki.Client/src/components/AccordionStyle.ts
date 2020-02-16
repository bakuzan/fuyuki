/* tslint:disable:object-literal-sort-keys */
import { sheet } from 'meiko/styles/nano';

const resetButtonStyles = {
  background: 'none',
  border: 'none',
  boxShadow: 'none'
};

export default sheet({
  accordion: {
    padding: `10px 0`,
    margin: `0 1px`
  },
  accordion__heading: {
    display: `flex`,
    justifyContent: `space-between`,
    padding: `5px`,
    borderBottom: `1px solid`,
    fontSize: `1.2em`
  },
  accordion__toggler: {
    ...resetButtonStyles,
    position: `relative`,
    cursor: `pointer`,
    padding: `0 6px 0 15px`,
    textAlign: `left`,
    width: `100%`,
    [`&::before, &::after`]: {
      content: '',
      position: `absolute`,
      backgroundColor: `#000`,
      transition: `0.5s`,
      top: `50%`
    },
    [`&::before`]: {
      left: `0px`,
      width: `10px`,
      height: `2px`,
      marginTop: `-1px`,
      transform: `rotate(360deg)`
    },
    [`&::after`]: {
      left: `4px`,
      height: `10px`,
      width: `2px`,
      marginTop: `-5px`,
      transform: `rotate(450deg)`
    }
  },
  accordion__toggler_checked: {
    [`&--checked::before, &--checked::after`]: {
      transform: `rotate(0deg)`,
      transition: `0.5s`
    }
  },
  accordion__content: {
    height: `auto`,
    overflow: `hidden`,
    opacity: 1,
    transition: `0.5s`,
    transitionDelay: `0.1s`
  },
  accordion__content_collapsed: {
    height: `1px`,
    opacity: 0,
    transitionDelay: `0.25s`
  }
});
