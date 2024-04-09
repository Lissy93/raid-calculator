import van from "vanjs-core"
import './styles/styles.scss';
import './styles/background.css';

const { section, h1, h2, p, a, ul, li, div, label, input, button, table, thead, tbody, tr, th, td } = van.tags

const calculateRaid = (diskCount: number, diskSize: number) => {
  const raids = [
    {
      name: "RAID 0",
      totalCapacity: diskCount * diskSize,
      speedGain: "High",
      faultTolerance: "None",
      notes: "",
    },
    {
      name: "RAID 1",
      totalCapacity: diskSize,
      speedGain: "Low",
      faultTolerance: "High",
      notes: diskCount % 2 !== 0 ? "One disk will be unused." : "",
    },
    {
      name: "RAID 5",
      totalCapacity: (diskCount - 1) * diskSize,
      speedGain: "Medium",
      faultTolerance: "Medium",
      notes: diskCount < 3 ? "At least 3 disks required." : "",
    },
    {
      name: "RAID 6",
      totalCapacity: (diskCount - 2) * diskSize,
      speedGain: "Medium",
      faultTolerance: "High",
      notes: diskCount < 4 ? "At least 4 disks required." : ""
    },
    {
      name: "RAID 10 (1+0)",
      totalCapacity: diskCount / 2 * diskSize,
      speedGain: "High",
      faultTolerance: "High",
      notes: diskCount < 4 || diskCount % 2 !== 0 ? "Requires an even number of disks, minimum 4." : ""
    },
    {
      name: "RAID 01 (0+1)",
      totalCapacity: diskCount / 2 * diskSize,
      speedGain: "High",
      faultTolerance: "High",
      notes: diskCount < 4 || diskCount % 2 !== 0 ? "Requires an even number of disks, minimum 4." : ""
    },
    {
      name: "RAID 50",
      totalCapacity: (diskCount - 2) * diskSize, // Assumes a stripe of two RAID 5 arrays
      speedGain: "High",
      faultTolerance: "Medium",
      notes: diskCount < 6 ? "Requires at least 6 disks." : "" + (diskCount % 3 !== 0 ? " Best used with a number of disks that is a multiple of 3." : "")
    },
  ]
  return raids;
}

const sortOptions = {
  'RAID Level': { key: 'name', isString: true },
  'Total Capacity (TB)': { key: 'totalCapacity', isString: false },
  'Speed Gain': { key: 'speedGain', isString: true, customOrder: ['High', 'Medium', 'Low', 'None'] },
  'Fault Tolerance': { key: 'faultTolerance', isString: true, customOrder: ['High', 'Medium', 'Low', 'None'] },
  'Configuration': { key: 'notes', isString: true }
};

let currentSort = { column: 'RAID Level', ascending: true };

const sortData = (raids, column, ascending) => {
  const { key, isString, customOrder } = sortOptions[column];
  raids.sort((a, b) => {
    if (customOrder) {
      return (ascending ? 1 : -1) * (customOrder.indexOf(a[key]) - customOrder.indexOf(b[key]));
    } else if (isString) {
      return (ascending ? 1 : -1) * a[key].localeCompare(b[key]);
    } else {
      return (ascending ? 1 : -1) * (a[key] - b[key]);
    }
  });
};

const makeCellClassName = (value: string | number, raids?: any) => {
  if (typeof value === 'string') {
    const lCaseVal = value.toLowerCase();
    if (lCaseVal === 'high') return 'green';
    if (lCaseVal === 'medium') return 'yellow';
    if (lCaseVal === 'low') return 'red';
    if (lCaseVal === 'none') return 'red';

    if (lCaseVal.includes('✅')) return 'green';
    if (lCaseVal.includes('requir')) return 'red';
    return 'yellow';
  }

  if (!isNaN(value) && raids) {
    const numericVal = parseInt(value.toString(), 10);

    // Extract totalCapacity values and sort them
    const capacities = raids.map(raid => raid.totalCapacity).sort((a, b) => a - b);
    
    // Find the percentile thresholds
    const lowerThirdIndex = Math.floor(capacities.length / 2.5);
    const upperThirdIndex = Math.floor(capacities.length * 2 / 2.5);
    const lowerThirdThreshold = capacities[lowerThirdIndex];
    const upperThirdThreshold = capacities[upperThirdIndex];

    // Assign colors based on percentile position
    if (numericVal <= lowerThirdThreshold) {
      return 'red';
    } else if (numericVal > lowerThirdThreshold && numericVal < upperThirdThreshold) {
      return 'yellow';
    } else {
      return 'green';
    }
  }


  return 'grey';
};

const showResults = (raids: any[]) => {

  const headers = ["RAID Level", "Total Capacity (TB)", "Speed Gain", "Fault Tolerance", "Configuration"];

  const dom = document.getElementById('raid-results');
  const raidTable = table(
    thead(
      tr(headers.map(header => th({ onclick: () => {
        const ascending = currentSort.column === header ? !currentSort.ascending : true;
        currentSort = { column: header, ascending };
        sortData(raids, header, ascending);
        showResults(raids); // Re-render the table with sorted data
      }}, header)))
    ),
    tbody(raids.map(raid =>
      tr(
        td(raid.name),
        td({ className: makeCellClassName(raid.totalCapacity, raids) }, raid.totalCapacity),
        td({ className: makeCellClassName(raid.speedGain) }, raid.speedGain),
        td({ className: makeCellClassName(raid.faultTolerance) }, raid.faultTolerance),
        td({ className: makeCellClassName(raid.notes ? raid.notes : '✅') }, raid.notes ? `⚠️ ${raid.notes}` : '✅ No Issues'),
      )
    ))
  );
  if (dom) {
    if (dom.firstChild) {
      dom.removeChild(dom.firstChild);
    }
    van.add(dom, raidTable);
  }
};


const InputForm = () => {
  const inputDiskCount = input({type: "number", placeholder: "Number of Disks"})
  const inputDiskSize = input({type: "number", placeholder: "Disk Size (TB)"})

  return section(
    { className: 'input-form'},
    div(
      { className: 'form-row'},
      label('Number of Disks'),
      inputDiskCount,
    ),
    div(
      { className: 'form-row'},
      label('Disk Size (TB)'),
      inputDiskSize,
    ),
    button({onclick: () => {
      const diskCount = parseInt(inputDiskCount.value, 10)
      const diskSize = parseInt(inputDiskSize.value, 10)
      const raids = calculateRaid(diskCount, diskSize)
      showResults(raids)
    }}, "Calculate"),
  );
}

const CircleList = () => {
  const circleItems = []
  for (let i = 0; i < 10; i++) {
    circleItems.push(li())
  }

  return div(
    { className: 'area'},
    ul(
      { className: 'circles'},
      circleItems
    )
  )
}

const About = () => section(
  h2('About'),
  p(
    'RAID Calculator is a simple app for determining approximate capacity,'
    +' speed and fault tolerance of different RAID configurations.'
  ),

  p(
    'Developed by ',
    a({ href: 'https://aliciasykes.com'}, 'Alicia Sykes'),
    ' with ',
    a({ href: 'https://vanjs.org/'}, 'Van.js'),
    '. Source available at ',
    a({ href: 'https://github.com/lissy93/raid-calculator'}, 'github.com/lissy93/raid-calculator'),
    ', and licensed under ',
    a({ href: ''}, 'MIT'),
    ' © ',
    a({ href: 'https://as93.net'}, 'AS93'),
    ' 2024.',
  ),
);

const RaidComparison = () => div(
  { className: 'raid-app' },
  h1('RAID Calculator'),
  InputForm(),
  section({id: 'raid-results'},
    p({className: 'no-results-yet'}, 'Results will appear here'),
  ),
  About(),
)

van.add(document.body, RaidComparison(), CircleList())
