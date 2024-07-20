from django.contrib.auth.models import User

def user_groups(request):
    if request.user.is_authenticated:
        user = request.user
        groups = user.groups.all()
    else:
        groups = None
    
    return {
        'user_groups': groups,
    }
