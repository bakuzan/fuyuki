import React, { useContext } from 'react';

import RadioToggle from 'meiko/RadioToggle';

import { ThemeContext } from 'src/context';

const moon = '\uD83C\uDF19\uFE0E';
const sun = '\u2600\uFE0E';

function ThemeToggler() {
  const [isDarkTheme, setTheme] = useContext(ThemeContext);

  return (
    <RadioToggle
      className="theme-toggle"
      label="Switch between Dark and Light mode"
      name="theme"
      icons={[moon, sun]}
      checked={isDarkTheme}
      onChange={setTheme}
    />
  );
}

export default ThemeToggler;
