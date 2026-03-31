import React from 'react';
import PasswordInput from './PasswordInput';

export type PasswordProps = React.ComponentProps<typeof PasswordInput>;

const Password: React.FC<PasswordProps> = (props) => {
  return <PasswordInput {...props} />;
};

export default Password;
