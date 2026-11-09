(function (root) {
  "use strict";

  function calculateBMI(heightCm, weightKg) {
    return weightKg / ((heightCm / 100) ** 2);
  }

  function categoryForBMI(bmi) {
    if (bmi < 18.5) {
      return {
        group: "underweight",
        label: "저체중",
        guidance: "일반 범위보다 낮아요. 식사와 건강 상태를 함께 살펴보세요.",
      };
    }
    if (bmi < 23) {
      return {
        group: "normal",
        label: "정상",
        guidance: "일반적인 참고 범위에 있어요. 꾸준한 생활 습관을 이어가세요.",
      };
    }
    if (bmi < 25) {
      return {
        group: "overweight",
        label: "과체중",
        guidance: "일반 참고 범위보다 높아요. 균형 잡힌 식사와 활동을 살펴보세요.",
      };
    }
    if (bmi < 30) {
      return {
        group: "obese",
        label: "비만 1단계",
        guidance: "BMI만으로 건강을 판단할 수 없어요. 필요하면 전문가와 상담해 보세요.",
      };
    }
    if (bmi < 35) {
      return {
        group: "obese",
        label: "비만 2단계",
        guidance: "개인의 건강 상태를 함께 확인할 수 있도록 전문가와 상담해 보세요.",
      };
    }
    return {
      group: "obese",
      label: "비만 3단계",
      guidance: "BMI는 참고 지표예요. 정확한 평가는 의료 전문가와 상의해 주세요.",
    };
  }

  function validateInput(date, height, weight) {
    if (!date) return "기록 날짜를 선택해 주세요.";
    if (!Number.isFinite(height) || height < 50 || height > 250) {
      return "키는 50cm 이상 250cm 이하로 입력해 주세요.";
    }
    if (!Number.isFinite(weight) || weight < 10 || weight > 500) {
      return "몸무게는 10kg 이상 500kg 이하로 입력해 주세요.";
    }
    return null;
  }

  root.HealthTrackerBMI = { calculateBMI, categoryForBMI, validateInput };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = root.HealthTrackerBMI;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
