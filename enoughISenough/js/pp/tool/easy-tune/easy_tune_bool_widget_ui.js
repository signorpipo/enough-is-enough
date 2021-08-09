
PP.EasyTuneBoolWidgetUI = class EasyTuneBoolWidgetUI {

    build(parentObject, setup, additionalSetup) {
        this._myParentObject = parentObject;
        this._mySetup = setup;
        this._myAdditionalSetup = additionalSetup;

        this._myAdditionalButtonsActive = true;

        this._myPlaneMesh = PP.MeshUtils.createPlaneMesh();

        this._createSkeleton();
        this._setTransforms();
        this._addComponents();
    }

    setVisible(visible) {
        this.myPivotObject.pp_setActiveHierarchy(visible);
        if (visible) {
            this.setAdditionalButtonsActive(this._myAdditionalButtonsActive);
        }
    }

    setAdditionalButtonsActive(active) {
        this._myAdditionalButtonsActive = active;
        this.myValueIncreaseButtonPanel.pp_setActiveHierarchy(this._myAdditionalButtonsActive);
        this.myValueDecreaseButtonPanel.pp_setActiveHierarchy(this._myAdditionalButtonsActive);
    }

    //Skeleton
    _createSkeleton() {
        this.myPivotObject = WL.scene.addObject(this._myParentObject);

        this.myBackPanel = WL.scene.addObject(this.myPivotObject);
        this.myBackBackground = WL.scene.addObject(this.myBackPanel);

        this._createDisplaySkeleton();
        this._createPointerSkeleton();
    }

    _createDisplaySkeleton() {
        this.myDisplayPanel = WL.scene.addObject(this.myPivotObject);

        this.myVariableLabelPanel = WL.scene.addObject(this.myDisplayPanel);
        this.myVariableLabelText = WL.scene.addObject(this.myVariableLabelPanel);

        this.myValuePanel = WL.scene.addObject(this.myDisplayPanel);
        this.myValueText = WL.scene.addObject(this.myValuePanel);
        this.myValueCursorTarget = WL.scene.addObject(this.myValuePanel);

        //Next/Previous
        this.myNextButtonPanel = WL.scene.addObject(this.myVariableLabelPanel);
        this.myNextButtonBackground = WL.scene.addObject(this.myNextButtonPanel);
        this.myNextButtonText = WL.scene.addObject(this.myNextButtonPanel);
        this.myNextButtonCursorTarget = WL.scene.addObject(this.myNextButtonPanel);

        this.myPreviousButtonPanel = WL.scene.addObject(this.myVariableLabelPanel);
        this.myPreviousButtonBackground = WL.scene.addObject(this.myPreviousButtonPanel);
        this.myPreviousButtonText = WL.scene.addObject(this.myPreviousButtonPanel);
        this.myPreviousButtonCursorTarget = WL.scene.addObject(this.myPreviousButtonPanel);

        //Increase/Decrease
        this.myValueIncreaseButtonPanel = WL.scene.addObject(this.myValuePanel);
        this.myValueIncreaseButtonBackground = WL.scene.addObject(this.myValueIncreaseButtonPanel);
        this.myValueIncreaseButtonText = WL.scene.addObject(this.myValueIncreaseButtonPanel);
        this.myValueIncreaseButtonCursorTarget = WL.scene.addObject(this.myValueIncreaseButtonPanel);

        this.myValueDecreaseButtonPanel = WL.scene.addObject(this.myValuePanel);
        this.myValueDecreaseButtonBackground = WL.scene.addObject(this.myValueDecreaseButtonPanel);
        this.myValueDecreaseButtonText = WL.scene.addObject(this.myValueDecreaseButtonPanel);
        this.myValueDecreaseButtonCursorTarget = WL.scene.addObject(this.myValueDecreaseButtonPanel);
    }

    _createPointerSkeleton() {
        this.myPointerCursorTarget = WL.scene.addObject(this.myPivotObject);
    }

    //Transforms
    _setTransforms() {
        this.myPivotObject.setTranslationLocal(this._mySetup.myPivotObjectPositions[this._myAdditionalSetup.myHandednessIndex]);

        this.myBackPanel.setTranslationLocal(this._mySetup.myBackPanelPosition);
        this.myBackBackground.scale(this._mySetup.myBackBackgroundScale);

        this._setDisplayTransforms();
        this._setPointerTransform();
    }

    _setDisplayTransforms() {
        this.myDisplayPanel.setTranslationLocal(this._mySetup.myDisplayPanelPosition);

        this.myVariableLabelPanel.setTranslationLocal(this._mySetup.myVariableLabelPanelPosition);
        this.myVariableLabelText.scale(this._mySetup.myVariableLabelTextScale);

        this.myValuePanel.setTranslationLocal(this._mySetup.myValuePanelPosition);
        this.myValueText.scale(this._mySetup.myValueTextScale);
        this.myValueCursorTarget.setTranslationLocal(this._mySetup.myValueCursorTargetPosition);

        //Next/Previous
        this.myNextButtonPanel.setTranslationLocal(this._mySetup.myRightSideButtonPosition);
        this.myNextButtonBackground.scale(this._mySetup.mySideButtonBackgroundScale);
        this.myNextButtonText.setTranslationLocal(this._mySetup.mySideButtonTextPosition);
        this.myNextButtonText.scale(this._mySetup.mySideButtonTextScale);
        this.myNextButtonCursorTarget.setTranslationLocal(this._mySetup.mySideButtonCursorTargetPosition);

        this.myPreviousButtonPanel.setTranslationLocal(this._mySetup.myLeftSideButtonPosition);
        this.myPreviousButtonBackground.scale(this._mySetup.mySideButtonBackgroundScale);
        this.myPreviousButtonText.setTranslationLocal(this._mySetup.mySideButtonTextPosition);
        this.myPreviousButtonText.scale(this._mySetup.mySideButtonTextScale);
        this.myPreviousButtonCursorTarget.setTranslationLocal(this._mySetup.mySideButtonCursorTargetPosition);

        //Increase/Decrease
        this.myValueIncreaseButtonPanel.setTranslationLocal(this._mySetup.myRightSideButtonPosition);
        this.myValueIncreaseButtonBackground.scale(this._mySetup.mySideButtonBackgroundScale);
        this.myValueIncreaseButtonText.setTranslationLocal(this._mySetup.mySideButtonTextPosition);
        this.myValueIncreaseButtonText.scale(this._mySetup.mySideButtonTextScale);
        this.myValueIncreaseButtonCursorTarget.setTranslationLocal(this._mySetup.mySideButtonCursorTargetPosition);

        this.myValueDecreaseButtonPanel.setTranslationLocal(this._mySetup.myLeftSideButtonPosition);
        this.myValueDecreaseButtonBackground.scale(this._mySetup.mySideButtonBackgroundScale);
        this.myValueDecreaseButtonText.setTranslationLocal(this._mySetup.mySideButtonTextPosition);
        this.myValueDecreaseButtonText.scale(this._mySetup.mySideButtonTextScale);
        this.myValueDecreaseButtonCursorTarget.setTranslationLocal(this._mySetup.mySideButtonCursorTargetPosition);
    }

    _setPointerTransform() {
        this.myPointerCursorTarget.setTranslationLocal(this._mySetup.myPointerCursorTargetPosition);
    }

    //Components
    _addComponents() {
        this.myBackBackgroundComponent = this.myBackBackground.addComponent('mesh');
        this.myBackBackgroundComponent.mesh = this._myPlaneMesh;
        this.myBackBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myBackBackgroundComponent.material.color = this._mySetup.myBackBackgroundColor;

        this._addDisplayComponents();
        this._addPointerComponents();
    }

    _addDisplayComponents() {
        this.myVariableLabelTextComponent = this.myVariableLabelText.addComponent('text');
        this._setupTextComponent(this.myVariableLabelTextComponent);
        this.myVariableLabelTextComponent.text = " ";

        this.myValueTextComponent = this.myValueText.addComponent('text');
        this._setupTextComponent(this.myValueTextComponent);
        this.myValueTextComponent.text = " ";

        this.myValueCursorTargetComponent = this.myValueCursorTarget.addComponent('cursor-target');
        this.myValueCollisionComponent = this.myValueCursorTarget.addComponent('collision');
        this.myValueCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myValueCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myValueCollisionComponent.extents = this._mySetup.myValueCollisionExtents;

        //Next/Previous
        this.myNextButtonBackgroundComponent = this.myNextButtonBackground.addComponent('mesh');
        this.myNextButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myNextButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myNextButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myNextButtonTextComponent = this.myNextButtonText.addComponent('text');
        this._setupTextComponent(this.myNextButtonTextComponent);
        this.myNextButtonTextComponent.text = this._mySetup.myNextButtonText;

        this.myNextButtonCursorTargetComponent = this.myNextButtonCursorTarget.addComponent('cursor-target');
        this.myNextButtonCollisionComponent = this.myNextButtonCursorTarget.addComponent('collision');
        this.myNextButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myNextButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myNextButtonCollisionComponent.extents = this._mySetup.mySideButtonCollisionExtents;

        this.myPreviousButtonBackgroundComponent = this.myPreviousButtonBackground.addComponent('mesh');
        this.myPreviousButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myPreviousButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myPreviousButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myPreviousButtonTextComponent = this.myPreviousButtonText.addComponent('text');
        this._setupTextComponent(this.myPreviousButtonTextComponent);
        this.myPreviousButtonTextComponent.text = this._mySetup.myPreviousButtonText;

        this.myPreviousButtonCursorTargetComponent = this.myPreviousButtonCursorTarget.addComponent('cursor-target');
        this.myPreviousButtonCollisionComponent = this.myPreviousButtonCursorTarget.addComponent('collision');
        this.myPreviousButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myPreviousButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myPreviousButtonCollisionComponent.extents = this._mySetup.mySideButtonCollisionExtents;

        //Increase/Decrease
        this.myValueIncreaseButtonBackgroundComponent = this.myValueIncreaseButtonBackground.addComponent('mesh');
        this.myValueIncreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myValueIncreaseButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myValueIncreaseButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myValueIncreaseButtonTextComponent = this.myValueIncreaseButtonText.addComponent('text');
        this._setupTextComponent(this.myValueIncreaseButtonTextComponent);
        this.myValueIncreaseButtonTextComponent.text = this._mySetup.myIncreaseButtonText;

        this.myValueIncreaseButtonCursorTargetComponent = this.myValueIncreaseButtonCursorTarget.addComponent('cursor-target');
        this.myValueIncreaseButtonCollisionComponent = this.myValueIncreaseButtonCursorTarget.addComponent('collision');
        this.myValueIncreaseButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myValueIncreaseButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myValueIncreaseButtonCollisionComponent.extents = this._mySetup.mySideButtonCollisionExtents;

        this.myValueDecreaseButtonBackgroundComponent = this.myValueDecreaseButtonBackground.addComponent('mesh');
        this.myValueDecreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myValueDecreaseButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myValueDecreaseButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myValueDecreaseButtonTextComponent = this.myValueDecreaseButtonText.addComponent('text');
        this._setupTextComponent(this.myValueDecreaseButtonTextComponent);
        this.myValueDecreaseButtonTextComponent.text = this._mySetup.myDecreaseButtonText;

        this.myValueDecreaseButtonCursorTargetComponent = this.myValueDecreaseButtonCursorTarget.addComponent('cursor-target');
        this.myValueDecreaseButtonCollisionComponent = this.myValueDecreaseButtonCursorTarget.addComponent('collision');
        this.myValueDecreaseButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myValueDecreaseButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myValueDecreaseButtonCollisionComponent.extents = this._mySetup.mySideButtonCollisionExtents;
    }

    _addPointerComponents() {
        this.myPointerCollisionComponent = this.myPointerCursorTarget.addComponent('collision');
        this.myPointerCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myPointerCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myPointerCollisionComponent.extents = this._mySetup.myPointerCollisionExtents;
    }

    _setupTextComponent(textComponent) {
        textComponent.alignment = this._mySetup.myTextAlignment;
        textComponent.justification = this._mySetup.myTextJustification;
        textComponent.material = this._myAdditionalSetup.myTextMaterial.clone();
        textComponent.material.outlineRange = this._mySetup.myTextOutlineRange;
        textComponent.material.color = this._mySetup.myTextColor;
        textComponent.material.outlineColor = this._mySetup.myTextOutlineColor;
        textComponent.text = "";
    }
};