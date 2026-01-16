// js/consult.js
document.addEventListener('DOMContentLoaded', function() {
    // 1. 获取DOM元素
    const consultForm = document.getElementById('consultForm');
    const formTip = document.getElementById('formTip');

    // 2. 表单提交事件
    if (consultForm) {
        consultForm.addEventListener('submit', function(e) {
            e.preventDefault(); // 阻止默认跳转

            // 3. 获取表单数据
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                company: document.getElementById('company').value.trim(),
                demand: document.getElementById('demand').value.trim()
            };

            // 4. 前端验证
            if (!formData.name || !formData.phone || !formData.company || !formData.demand) {
                showTip('请填写完整的咨询信息！', 'text-red-500');
                return;
            }
            // 手机号/座机号简单验证（适配多种格式）
            const phoneReg = /^(\+?86)?\s?1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/;
            if (!phoneReg.test(formData.phone.replace(/\s/g, ''))) {
                showTip('请填写有效的手机号（11位）或座机号（如029-XXXXXXX）！', 'text-red-500');
                return;
            }

            // 5. 提交数据到后端
            fetch('http://localhost:3000/api/consult', { // 后续替换为实际后端地址
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            .then(response => {
                if (!response.ok) throw new Error('服务器响应异常');
                return response.json();
            })
            .then(data => {
                if (data.code === 200) {
                    showTip('咨询提交成功！我们将在1个工作日内与您联系', 'text-green-500');
                    consultForm.reset(); // 清空表单
                } else {
                    showTip('提交失败：' + (data.msg || '服务器处理失败'), 'text-red-500');
                }
            })
            .catch(error => {
                console.error('提交错误：', error);
                showTip('网络异常，请稍后重试！', 'text-red-500');
            });
        });
    }

    // 6. 提示信息展示函数
    function showTip(text, className) {
        if (formTip) {
            formTip.textContent = text;
            formTip.className = `mt-4 text-center ${className}`;
            formTip.classList.remove('hidden');
            
            // 5秒后隐藏提示
            setTimeout(() => {
                formTip.classList.add('hidden');
            }, 5000);
        }
    }
});