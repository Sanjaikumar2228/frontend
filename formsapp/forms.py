from django import forms

class EmployeeForm(forms.Form):
    empid = forms.CharField(max_length=100)
    name = forms.CharField(max_length=100)
    age = forms.IntegerField()
    desg = forms.CharField(max_length=100)
    address = forms.CharField(max_length=100)
    salary = forms.IntegerField()

    def clean_name(self):
        name = self.cleaned_data['name']
        if ord(name[0]) >= 48 and ord(name[0]) <= 57:
            raise forms.ValidationError("Name should not start with number")
        return name
    def clean_age(self):
        age = self.cleaned_data['age']
        if age<0:
            raise forms.ValidationError("Age should positive")
