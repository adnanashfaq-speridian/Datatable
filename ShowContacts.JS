import { LightningElement , api, wire } from 'lwc';
import updateContactEmail1 from '@salesforce/apex/ContactsDMLController.updateContactEmail';
import {updateRecord} from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';	
import { refreshApex } from '@salesforce/apex';

export default class ShowContacts extends LightningElement {

    @api listOfContacts;
    //contacts;

    columns = [
        { label: 'Id', fieldName: 'Id', type: 'text' },
        { label: 'Name', fieldName: 'Name', type: 'text' },
        { label: 'Email', fieldName: 'Email', type: 'email' , editable : true},
        // Add more columns as needed
    ];
    draftValues = [];

    handleSave(event){
        console.log('listOfContacts ==='+JSON.stringify(this.listOfContacts));
        this.saveDraftValues = event.detail.draftValues;
        console.log('recordinput == '+JSON.stringify(this.saveDraftValues));
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return {fields};
        });
        console.log('recordinput == '+JSON.stringify(recordInputs));
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));

        Promise.all(promises).then(res => {
            this.ShowToast('Success','Records updated', 'success', 'dismissable');
            this.saveDraftValues = [];
            return this.refresh();
        }).catch(error =>{
            this.ShowToast('Error ', 'An error occurred', 'error', 'dismissable');
        }).finally(() => {
            this.saveDraftValues = [];
        });
    }

    ShowToast(){
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode:mode
        });
        this.dispatchEvent(evt);
    }

    async refresh(){
        await refreshApex(this.listOfContacts);
    }

    updateContactEmail() {

        updateContactEmail1({contacts: this.listOfContacts})
            .then(result => {
                console.log('result: ' + result);
            })

    }
}
