import * as React from 'react';
import { FunctionComponent } from 'react';

const Greeting: FunctionComponent<{ name?: string }> = ({ name = 'Someone' }) => {
  return <h2>{`Hello ${name}!`}</h2>;
};

export default Greeting;
