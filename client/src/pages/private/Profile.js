import './Profile.css';

import React, {Component} from 'react';

import Button from '../../components/Button';
import Api from '../../service/Api';
import Utils from '../../utils/Utils';

import {csYup} from '../../components/form/csYup';
import { Formik, Form } from 'formik';
import Field from '../../components/form/Field';
import CSButton from '../../components/form/CSButton';

const ProfileSchema = csYup(yup => {
  return yup.object().shape({
    name: yup.string().required().default(''),
    nickname: yup.string().required().default(''),
    email: yup.string().default(''),
    nickname: yup.string().default(''),
    avatar: yup.mixed().default(undefined),
  })
});

class ProfilePage extends Component {

  state = {
    loading: true,
    initProfile: ProfileSchema.default()
  }

  async componentDidMount(){
    const sessionInfo = await Utils.getSessionInfo();
    if(!!sessionInfo){
      this.setState({initProfile: sessionInfo.user, loading: false});
    } else {
      this.setState({loading: false});
    }
  }

  saveProfile = async (values, actions) => {
    const {avatar, id, ...profileValues} = values;
    const profile = profileValues;
    try {
      if(!!avatar && typeof avatar === 'object'){
        const {path} = await Api.File.upload({file: avatar});
        profile.avatar = path;
      }
      await Api.User.update(id, profile);
      Utils.setSessionInfo(profile);
    } catch(e) {
      console.error('error trying to save profile...', e);
    }
  }

  render(){
    const {loading, games, initProfile} = this.state;

    if(loading) return null;
    return (
      <div className="Profile">
        <div className="ContentTitle">
          <h2 className="Title">Meu Perfil</h2>
        </div>
        <div>
          <Formik
            validationSchema={ProfileSchema}
            initialValues={this.state.initProfile}
            onSubmit={this.saveProfile}>
            <Form>
              <div className="ProfileForm">
                <div className="AvatarForm">
                  <Field name="avatar"
                         type="file"/>
                </div>
                <div className="ProfileData">
                  <div className="Form">
                    <div>
                      <Field title="Nome" name="name" required={true}/>
                      <Field title="Apelido" name="nickname"/>
                      <Field title="E-mail" name="email"/>
                    </div>
                    <CSButton type="submit">Salvar</CSButton>
                  </div>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    )
  }

}

export default ProfilePage;
