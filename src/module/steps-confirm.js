import React from 'react';
import { Steps } from 'antd';

import './steps-confirm.css';

function StepsConfirm({steps = [
    {title: '確認訂單', content: '第一步驟'},
    {title: '付款結帳', content: '第二步驟'},
    {title: '準備露營', content: '第三步驟'}
  ], currentStep = 0}) {

    return (
        <div className='content-style'>
            <Steps current={currentStep} items={steps}></Steps>
        </div>
    );
}

export default StepsConfirm;
