import { observer } from 'mobx-react-lite';
import React from 'react';
import { Modal } from 'semantic-ui-react';
import useStores from '../../stores/stores';

export default observer(function ModalContainer(){
    const {modalStore} = useStores();
    return (
        <Modal open={modalStore.modal.open} onClose={modalStore.closeModal} size='mini'>
            <Modal.Content>
                {modalStore.modal.body}
            </Modal.Content>
        </Modal>
    )
})