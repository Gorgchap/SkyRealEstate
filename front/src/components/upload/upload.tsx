import React, { useEffect, useMemo, useState } from 'react';
import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import { FileUploader } from '@src/components';
import { UploadFile } from '@src/models';
import { gridProperties } from '@src/utils';
import './upload.less';

const types = ['XLS', 'XLSX'];

export const Upload = (): JSX.Element => {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<UploadFile[]>([]);
  const [statuses, setStatues] = useState<string[]>([]);
  const [submit, setSubmit] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<UploadFile[]>();
  const disabled = useMemo(() => statuses.length < 1 || statuses.some(e => e !== 'success') || submit, [statuses, submit]);

  const getExtension = (name: string): string => name.split('.').slice(-1)[0].toLowerCase();

  const onChange = (fs: File[]): void => {
    setFiles(fs);
    setResult(Array.from({ length: fs.length }, () => ({} as UploadFile)));
    setStatues(Array.from({ length: fs.length }, () => 'loading'));
    fs.forEach((file: File, index: number) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const item = {
          date: new Date(file.lastModified).toISOString(),
          name: file.name,
          result: reader.result as string,
          size: file.size,
        };
        setResult(value => value.map((e: UploadFile, i: number) => index === i ? item : e));
        setStatues(value => value.map((e: string, i: number) => index === i ? 'success' : e));
      };
      reader.readAsDataURL(file);
    });
  };

  const onDelete = (index: number): void => {
    setFiles(value => value.filter((e: File, i: number) => index !== i));
    setResult(value => value.filter((e: UploadFile, i: number) => index !== i));
    setStatues(value => value.filter((e: string, i: number) => index !== i));
  };

  const onSubmit = (): void => {
    setSubmit(true);
    console.log(result);
    setTimeout(() => setSubmit(false), 5000);
  };

  useEffect(() => {
    setUploaded([]);
  }, []);

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
                  <a className="download-icon" download={file.name} href={file.result}></a>
                </div>
              ))
            }
          </>
        )
      }
    </Grid>
  );
};
