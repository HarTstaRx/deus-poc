import React from 'react';

import './Modal.scss';

interface ModalProps {
  children: JSX.Element;
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

export const Modal = ({
  isOpen,
  children,
  title,
  onClose,
}: ModalProps): JSX.Element => {
  if (!isOpen) return <></>;

  return (
    <>
      <div
        className='modal-background'
        onClick={onClose}
      >
        &nbsp;
      </div>
      <div className='modal-content'>
        <h3 className='modal-content__header'>{title}</h3>
        <div className='modal-content__body'>{children}</div>
      </div>
    </>
  );
};
