import React, { Component, Fragment} from 'react';

import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';

import FileService from '../../service/FileService';
import FileField from '../../components/form/FileField';
import CSButton from '../../components/form/CSButton';

const FileSchema = yup.object().shape({
  file: yup.mixed().required().default(undefined),
});

class UploadExample extends Component {

  initUpload = FileSchema.default();

  uploadFile = async (values, actions) => {
    try {
      await FileService.upload(values);
      actions.resetForm(FileSchema.default());
    } catch(e) {
      console.error('error trying to upload', e);
    }
  }

  render(){
    return(
      <Fragment>
        <h1 className="Title">Upload de Imagens</h1>
        <Formik
          validationSchema={FileSchema}
          initialValues={this.initUpload}
          onSubmit={this.uploadFile}>
          <Form>
            <div className="Form">
              <Field name="file" component={FileField}/>
              <CSButton type="submit" className="Dark">Enviar</CSButton>
            </div>
          </Form>
        </Formik>
      </Fragment>
    )
  }
}

export default UploadExample;
