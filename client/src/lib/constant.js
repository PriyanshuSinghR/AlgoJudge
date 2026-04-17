export const DEFAULT_CODE = {
	javascript: `function solve() {
  console.log("Hello World");
}`,

	python: `def solve():
    print("Hello World")`,

	java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,

	cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World";
    return 0;
}`,
};

export const LANGUAGES = {
	javascript: "JavaScript",
	python: "Python",
	java: "Java",
	cpp: "C++",
};

export const CODE_EXAMPLES = {
	javascript: `// Two Sum
function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];

    if (map.has(diff)) {
      return [map.get(diff), i];
    }

    map.set(nums[i], i);
  }
}`,

	python: `# Two Sum
def two_sum(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        diff = target - num

        if diff in seen:
            return [seen[diff], i]

        seen[num] = i`,

	java: `// Two Sum
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];

            if (map.containsKey(diff)) {
                return new int[] { map.get(diff), i };
            }

            map.put(nums[i], i);
        }

        return new int[] {};
    }
}`,

	cpp: `// Two Sum
class Solution {
    public:
        vector<int> twoSum(vector<int>& nums, int target) {
            unordered_map<int, int> map;

            for (int i = 0; i < nums.size(); i++) {
                int diff = target - nums[i];

                if (map.count(diff)) {
                    return { map[diff], i };
                }

                map[nums[i]] = i;
            }

            return {};
        }
};`,
};
