from rest_framework import serializers
from plans.models import Plan
from users.serializers import ProfileSerializer


class PlanSerializer(serializers.ModelSerializer):
    # A plan could exist without a profile.
    profile = ProfileSerializer(source="profile_set", many=True, required=False)

    class Meta:
        model = Plan
        fields = (
            "plan_name",
            "max_number_invites",
            "storage_size",
            "profile",
            "price",
            "frequency",
        )


# Serializers for all available plans without profiles associated with the individual plans.
class PlanWithoutProfilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = "__all__"
