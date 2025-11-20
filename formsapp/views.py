from django.shortcuts import render
from formsapp.forms import EmployeeForm

# Create your views here.
def index(request):
    form = EmployeeForm()
    if request.method=='POST':
        form = EmployeeForm(request.POST)
        if form.is_valid():
            print("Validation Success")
        
    return render(request,"index.html",{'form':form})