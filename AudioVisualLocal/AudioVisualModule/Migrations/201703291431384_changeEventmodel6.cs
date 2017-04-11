namespace AudioVisualModule.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changeEventmodel6 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Events", "UserEmail");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Events", "UserEmail", c => c.String());
        }
    }
}
