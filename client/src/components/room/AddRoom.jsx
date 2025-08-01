import React, {useState} from 'react';
import {Button, Card, Col, Form, InputNumber, message, Row, Select, Upload,} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {addNewRoom} from '../utils/ApiFunctions';
import {Link} from 'react-router-dom';

// Component RoomTypeSelector sẽ được thay thế bằng AntD Select
// và danh sách loại phòng sẽ được định nghĩa ở đây để minh hoạ
const roomTypes = [
    { value: 'SINGLE', label: 'Single Room' },
    { value: 'DOUBLE', label: 'Double Room' },
    { value: 'SUITE', label: 'Suite' },
    { value: 'DELUXE', label: 'Deluxe' },
];

export const AddRoom = () => {
    const [form] = Form.useForm();
    const [imagePreview, setImagePreview] = useState('');
    const [fileList, setFileList] = useState([]);

    const handleSubmit = async (values) => {
        try {
            const { roomType, roomPrice, image } = values;
            const selectedImage = image?.[0]?.originFileObj;

            if (!selectedImage) {
                message.error('Please select an image.');
                return;
            }

            const success = await addNewRoom(selectedImage, roomType, roomPrice);
            if (success !== undefined) {
                message.success('A new room was added successfully!');
                form.resetFields();
                setImagePreview('');
                setFileList([]);
            } else {
                message.error('Error adding room. Please try again.');
            }
        } catch (error) {
            message.error(`Failed to add room: ${error.message}`);
        }
    };

    const handleImageChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (newFileList.length > 0) {
            const selectedImage = newFileList[0];
            setImagePreview(URL.createObjectURL(selectedImage.originFileObj));
        } else {
            setImagePreview('');
        }
    };

    return (
        <Row justify="center" style={{ marginTop: '50px', marginBottom: '50px' }}>
            <Col xs={24} sm={20} md={16} lg={12}>
                <Card title="Add a New Room">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{ roomPrice: 0 }}
                    >
                        <Form.Item
                            name="roomType"
                            label="Room Type"
                            rules={[{ required: true, message: 'Please select a room type!' }]}
                        >
                            <Select
                                placeholder="Select a room type"
                                options={roomTypes}
                            />
                        </Form.Item>

                        <Form.Item
                            name="roomPrice"
                            label="Room Price"
                            rules={[{ required: true, message: 'Please input the room price!' }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>

                        <Form.Item
                            name="image"
                            label="Image"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                                if (Array.isArray(e)) {
                                    return e;
                                }
                                return e && e.fileList;
                            }}
                            rules={[{ required: true, message: 'Please upload an image!' }]}
                        >
                            <Upload
                                listType="picture"
                                maxCount={1}
                                beforeUpload={() => false} // Ngăn AntD tự động upload
                                onChange={handleImageChange}
                                fileList={fileList}
                            >
                                <Button icon={<UploadOutlined />}>Select File</Button>
                            </Upload>
                        </Form.Item>

                        {imagePreview && (
                            <Form.Item>
                                <img
                                    src={imagePreview}
                                    alt="Room Preview"
                                    style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                                />
                            </Form.Item>
                        )}

                        <Form.Item>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                                <Link to={"/rooms"}>
                                    <Button danger>Cancel</Button>
                                </Link>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};