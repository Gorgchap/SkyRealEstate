import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDragging } from '@src/hooks';
import './file-uploader.less';

interface Props {
  children?: JSX.Element;
  classes?: string;
  disabled?: boolean;
  handleChange?: (arg0: File | FileList) => void;
  hoverTitle?: string;
  files?: File | FileList | null;
  label?: string;
  maxSize?: number;
  minSize?: number;
  multiple?: boolean;
  name?: string;
  onDraggingStateChange?: (dragging: boolean) => void;
  onDrop?: (arg0: File | FileList) => void;
  onSelect?: (arg0: File | FileList) => void;
  onSizeError?: (arg0: string) => void;
  onTypeError?: (arg0: string) => void;
  types?: string[];
}

const addFile = require('../../../assets/images/add-file.svg').default;
const addFileDisabled = require('../../../assets/images/add-file-disabled.svg').default;

export const FileUploader = ({
  children,
  classes = '',
  disabled = false,
  handleChange,
  hoverTitle = '',
  maxSize,
  minSize,
  files,
  label,
  multiple = false,
  name,
  onDraggingStateChange,
  onDrop,
  onSelect,
  onSizeError,
  onTypeError,
  types = [],
}: Props): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);
  const [currFiles, setFiles] = useState<File | FileList | null>(null);
  const [error, setError] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const Types = (): JSX.Element => {
    if (types.length > 0) {
      const max = maxSize ? `size >= ${maxSize}, ` : '';
      const min = minSize ? `size <= ${minSize}, ` : '';
      const str = types.join(',');
      return <span className="file-types" title={`${max}${min}types: ${str}`}>{str}</span>;
    } else {
      return <></>;
    }
  }

  const validateFile = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!types.map((type: string) => type.toLowerCase()).includes(extension)) {
      setError(true);
      onTypeError?.('File type is not supported');
      return false;
    } else if (maxSize && file.size / 1048576 > maxSize) {
      setError(true);
      onSizeError?.('File size is too big');
      return false;
    } else if (minSize && file.size / 1048576 < minSize) {
      setError(true);
      onSizeError?.('File size is too small');
      return false;
    } else {
      return true;
    }
  };

  const handleChanges = (fs: File | FileList): boolean => {
    let checkError = false;
    if (fs) {
      for (const file of fs instanceof File ? [fs] : fs) {
        checkError = !validateFile(file) || checkError;
      }
      if (checkError) return false;
      handleChange?.(fs);
      setFiles(fs);
      setUploaded(true);
      setError(false);
      return true;
    } else {
      return false;
    }
  };

  const blockEvent = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    inputRef?.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = multiple ? e.target.files : e.target.files[0];
    const success = handleChanges(files);
    if (onSelect && success) onSelect(files);
  };

  const className = useMemo(() => `uploader-wrapper ${classes}${disabled ? ' is-disabled' : ''}`, [classes, disabled]);
  const dragging = useDragging({ handleChange, inputRef, labelRef, multiple, onDrop });

  useEffect(() => {
    onDraggingStateChange?.(dragging);
  }, [dragging]);

  useEffect(() => {
    if (files) {
      setUploaded(true);
      setFiles(files);
    } else {
      if (inputRef.current) inputRef.current.value = '';
      setUploaded(false);
      setFiles(null);
    }
  }, [files]);

  return (
    <label className={className} htmlFor={name} onClick={blockEvent} ref={labelRef}>
      <input
        accept={types.map((type: string) => `.${type.toLowerCase()}`).join(',')}
        disabled={disabled}
        multiple={multiple}
        name={name}
        onChange={handleInputChange}
        onClick={handleClick}
        ref={inputRef}
        type="file"
      />
      {dragging && (
        <div className="hover-message">
          <span>{hoverTitle || 'Drop here'}</span>
        </div>
      )}
      {children || (
        <>
          <img src={disabled ? addFileDisabled : addFile} alt="Please add file or files" />
          <div className={`description-wrapper ${error ? 'error' : ''}`}>
            {
              error ? (
                <span>
                  File type/size error, hovered on types!
                </span>
              ) : (
                <span>
                  {disabled ? (
                    <span>Upload disabled</span>
                  ) : !currFiles && !uploaded ? (
                    <>
                      {label ? (
                        <>
                          <span>{label.split(' ')[0]}</span>{' '}
                          {label.substring(label.indexOf(' ') + 1)}
                        </>
                      ) : (
                        <><u>Upload</u> or drop a file right here</>
                      )}
                    </>
                  ) : (
                    <><u>Uploaded Successfully!</u> Upload another?</>
                  )}
                </span>
              )
            }
            <Types />
          </div>
        </>
      )}
    </label>
  );
};
