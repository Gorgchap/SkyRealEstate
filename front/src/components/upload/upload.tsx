import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import { download, list, upload } from '@src/api';
import { FileUploader } from '@src/components';
import { UserFile } from '@src/models';
import { gridProperties } from '@src/utils';
import './upload.less';

const types = ['XLS', 'XLSX'];

export const Upload = (): JSX.Element => {
  const [externalError, setExternalError] = useState<string>();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<UserFile[]>([]);
  const [statuses, setStatues] = useState<string[]>([]);
  const [submit, setSubmit] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<UserFile[]>();
  const disabled = useMemo(() => statuses.length < 1 || statuses.some(e => e !== 'success') || submit, [statuses, submit]);
  const navigate = useNavigate();

  const getData = useCallback(async () => {
    try {
      await setUploaded(await list(true));
    } catch (err) {
      console.error(err);
    }
  }, [setUploaded]);

  const getExtension = (name: string): string => name.split('.').slice(-1)[0].toLowerCase();

  const getItem = (file: File, index: number, result: string): void => {
    const item = { date: new Date(file.lastModified).toISOString(), name: file.name, result, size: file.size };
    setResult(value => value.map((e: UserFile, i: number) => index === i ? item : e));
    setStatues(value => value.map((e: string, i: number) => index === i ? (result ? 'success' : 'error') : e));
  };

  const onChange = (fs: File[]): void => {
    setFiles(fs);
    setResult(Array.from({ length: fs.length }, () => ({} as UserFile)));
    setStatues(Array.from({ length: fs.length }, () => 'loading'));
    fs.forEach((file: File, index: number) => {
      const reader = new FileReader();
      reader.onerror = () => getItem(file, index, '');
      reader.onload = () => getItem(file, index, reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const onDelete = (index: number): void => {
    setFiles(value => value.filter((e: File, i: number) => index !== i));
    setResult(value => value.filter((e: UserFile, i: number) => index !== i));
    setStatues(value => value.filter((e: string, i: number) => index !== i));
  };

  const onDownload = (file: UserFile): void => {
    download(file.id ?? '')
      .then(res => {
        const href = URL.createObjectURL(res);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', file.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .catch(err => console.error(err));
  };

  const onSubmit = async (): Promise<void> => {
    setExternalError('');
    setSubmit(true);
    try {
      await upload(result);
      navigate('/interactive');
    } catch (err) {
      console.error(err);
      setExternalError('проверьте входные данные на наличие неточностей');
    } finally {
      setSubmit(false);
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Grid container item { ...gridProperties }>
      {
        uploaded?.length < 1 && (
          <>
            <div className="uploader-image"></div>
            <Typography component="h4" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Сделайте первый расчёт
            </Typography>
            <Typography component="p" variant="subtitle1" sx={{ fontWeight: 300, mb: 3 }}>
              Здесь будут отображаться все ваши расчёты и выгрузки
            </Typography>
          </>
        )
      }
      <p className="uploader-description" style={{ marginBottom: 24 }}>
        Загрузите Excel со списком объектов
      </p>
      <FileUploader
        externalError={externalError}
        files={files.length > 0 ? files : null}
        handleChange={e => onChange(e)}
        maxCount={5}
        maxSize={10}
        types={types}
      />
      {
        files.length > 0 && statuses.length > 0 && files.map((file: File, index: number) => (
          <div className="uploader-file" key={file.name}>
            <div className={`file-icon file-icon-${getExtension(file.name)}`}></div>
            <p className="uploader-file__name">{file.name}</p>
            { statuses[index] !== 'loading' && (
              <button className="uploader-file__close" type="button" onClick={() => onDelete(index)}>
                &#10006;
              </button>
            )}
            { statuses[index] === 'error' && <div className="error-icon"></div> }
            { statuses[index] === 'loading' && <CircularProgress size={40} /> }
            { statuses[index] === 'success' && <div className="success-icon"></div> }
          </div>
        ))
      }
      <Button
        disabled={disabled}
        onClick={() => onSubmit()}
        startIcon={submit && <CircularProgress size={20} />}
        sx={{ mt: 3 }}
        type="submit"
        variant="contained"
      >
        Загрузить
      </Button>
      {
        uploaded?.length > 0 && (
          <>
            <p className="uploader-description" style={{ marginTop: 24, marginBottom: 24 }}>
              Последние выгрузки
            </p>
            {
              uploaded.map(file => (
                <div className="uploader-item" key={file.name}>
                  <div className={`file-icon file-icon-${getExtension(file.name)}`}></div>
                  <div className="file">
                    <p className="file-name">{file.name}</p>
                    <p className="file-date">{ new Date(file.date).toLocaleDateString() }</p>
                  </div>
                  <div className="download-icon" onClick={() => onDownload(file)}></div>
                </div>
              ))
            }
          </>
        )
      }
    </Grid>
  );
};
